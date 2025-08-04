"""
Netflix Clone - Search Microservice
Handles intelligent search with ML-powered ranking and personalization.
"""

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import redis
import json
import os
import re
from datetime import datetime
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Redis for caching
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    decode_responses=True
)

class SearchEngine:
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=10000,
            stop_words='english',
            ngram_range=(1, 2),
            lowercase=True
        )
        self.content_vectors = None
        self.content_df = None
        
    def load_data(self):
        """Load content data for search"""
        # Sample content data - in production, load from database
        self.content_df = pd.DataFrame({
            'id': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            'title': [
                'The Matrix', 'Inception', 'Interstellar', 'The Dark Knight', 'Pulp Fiction',
                'Stranger Things', 'Breaking Bad', 'The Office', 'Game of Thrones', 'Friends'
            ],
            'type': [
                'movie', 'movie', 'movie', 'movie', 'movie',
                'tv', 'tv', 'tv', 'tv', 'tv'
            ],
            'overview': [
                'A computer programmer discovers reality is a simulation and joins a rebellion',
                'A thief steals corporate secrets through dream-sharing technology',
                'Explorers travel through a wormhole to ensure humanity survival',
                'Batman faces the Joker in Gotham City',
                'The lives of mob hitmen and others intertwine in tales of violence',
                'Kids in a small town uncover supernatural mysteries',
                'A chemistry teacher turned methamphetamine manufacturer',
                'Mockumentary about office employees at a paper company',
                'Noble families fight for control over Westeros',
                'Six friends living in Manhattan'
            ],
            'genre': [
                ['Action', 'Sci-Fi'], ['Action', 'Sci-Fi', 'Thriller'], ['Adventure', 'Drama', 'Sci-Fi'],
                ['Action', 'Crime', 'Drama'], ['Crime', 'Drama'], ['Drama', 'Fantasy', 'Horror'],
                ['Crime', 'Drama', 'Thriller'], ['Comedy'], ['Action', 'Adventure', 'Drama'], ['Comedy', 'Romance']
            ],
            'rating': [8.7, 8.8, 8.6, 9.0, 8.9, 8.7, 9.5, 8.9, 9.3, 8.9],
            'year': [1999, 2010, 2014, 2008, 1994, 2016, 2008, 2005, 2011, 1994],
            'poster_path': [f'/placeholder.svg?height=600&width=400' 
                           for title in ['The Matrix', 'Inception', 'Interstellar', 'The Dark Knight', 'Pulp Fiction',
                                       'Stranger Things', 'Breaking Bad', 'The Office', 'Game of Thrones', 'Friends']]
        })
        
        # Build search index
        self.build_search_index()
        
    def build_search_index(self):
        """Build TF-IDF search index"""
        # Combine searchable text fields
        search_text = (
            self.content_df['title'] + ' ' + 
            self.content_df['overview'] + ' ' +
            self.content_df['genre'].apply(lambda x: ' '.join(x))
        )
        
        self.content_vectors = self.tfidf_vectorizer.fit_transform(search_text)
        
    def search_content(self, query, filters=None, user_preferences=None, limit=20):
        """Perform content search with ranking"""
        if not query.strip():
            return []
            
        # Vectorize query
        query_vector = self.tfidf_vectorizer.transform([query.lower()])
        
        # Calculate similarity scores
        similarity_scores = cosine_similarity(query_vector, self.content_vectors).flatten()
        
        # Get all results with scores
        results_df = self.content_df.copy()
        results_df['relevance_score'] = similarity_scores
        
        # Filter results with minimum relevance
        results_df = results_df[results_df['relevance_score'] > 0.01]
        
        # Apply filters
        if filters:
            results_df = self.apply_search_filters(results_df, filters)
            
        # Apply personalization boost
        if user_preferences:
            results_df = self.apply_personalization(results_df, user_preferences)
            
        # Sort by relevance and rating
        results_df['final_score'] = (
            results_df['relevance_score'] * 0.7 + 
            (results_df['rating'] / 10.0) * 0.3
        )
        
        results_df = results_df.sort_values('final_score', ascending=False)
        
        # Format results
        results = []
        for _, row in results_df.head(limit).iterrows():
            results.append({
                'id': row['id'],
                'title': row['title'],
                'type': row['type'],
                'poster_path': row['poster_path'],
                'overview': row['overview'],
                'rating': row['rating'],
                'year': row['year'],
                'genre': row['genre']
            })
            
        return results
        
    def apply_search_filters(self, df, filters):
        """Apply search filters"""
        filtered_df = df.copy()
        
        # Genre filter
        if filters.get('genre'):
            genre_filter = filters['genre'].lower()
            filtered_df = filtered_df[
                filtered_df['genre'].apply(
                    lambda genres: any(genre_filter in g.lower() for g in genres)
                )
            ]
            
        # Year filter
        if filters.get('year'):
            filtered_df = filtered_df[filtered_df['year'] == int(filters['year'])]
            
        # Rating filter
        if filters.get('rating'):
            min_rating = float(filters['rating'])
            filtered_df = filtered_df[filtered_df['rating'] >= min_rating]
            
        # Type filter (movie/tv)
        if filters.get('type'):
            filtered_df = filtered_df[filtered_df['type'] == filters['type']]
            
        return filtered_df
        
    def apply_personalization(self, df, user_preferences):
        """Apply personalization boost to search results"""
        boosted_df = df.copy()
        
        # Boost preferred genres
        preferred_genres = user_preferences.get('preferred_genres', [])
        if preferred_genres:
            def genre_boost(genres):
                boost = 1.0
                for pref_genre in preferred_genres:
                    if any(pref_genre.lower() in g.lower() for g in genres):
                        boost += 0.2
                return boost
                
            boosted_df['genre_boost'] = boosted_df['genre'].apply(genre_boost)
            boosted_df['relevance_score'] *= boosted_df['genre_boost']
            
        return boosted_df
        
    def get_search_suggestions(self, query, limit=5):
        """Get search suggestions/autocomplete"""
        if len(query) < 2:
            return []
            
        suggestions = []
        query_lower = query.lower()
        
        # Title-based suggestions
        for title in self.content_df['title']:
            if query_lower in title.lower() and title not in suggestions:
                suggestions.append(title)
                if len(suggestions) >= limit:
                    break
                    
        return suggestions

# Initialize search engine
search_engine = SearchEngine()
search_engine.load_data()

@app.route('/search', methods=['POST'])
def search():
    """Main search endpoint"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        filters = data.get('filters', {})
        user_preferences = data.get('user_preferences', {})
        user_id = data.get('user_id')
        
        if not query:
            return jsonify([])
            
        # Check cache
        cache_key = f"search:{hash(query)}:{hash(str(filters))}"
        cached_result = redis_client.get(cache_key)
        
        if cached_result:
            results = json.loads(cached_result)
        else:
            # Perform search
            results = search_engine.search_content(
                query, filters, user_preferences, limit=20
            )
            
            # Cache results for 30 minutes
            redis_client.setex(cache_key, 1800, json.dumps(results))
            
        return jsonify(results)
        
    except Exception as e:
        logging.error(f"Search error: {str(e)}")
        return jsonify({'error': 'Search failed'}), 500

@app.route('/search/suggestions', methods=['POST'])
def search_suggestions():
    """Search suggestions endpoint"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        suggestions = search_engine.get_search_suggestions(query)
        return jsonify(suggestions)
        
    except Exception as e:
        logging.error(f"Suggestions error: {str(e)}")
        return jsonify([]), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'search'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True)
