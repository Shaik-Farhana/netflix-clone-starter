"""
Netflix Clone - Recommendation Microservice
Handles AI-powered content recommendations using collaborative filtering,
content-based filtering, and hybrid approaches.
"""

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
import redis
import json
import os
from datetime import datetime, timedelta
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Redis for caching
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    decode_responses=True
)

class RecommendationEngine:
    def __init__(self):
        self.content_vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
        self.svd_model = TruncatedSVD(n_components=50, random_state=42)
        self.content_features = None
        self.user_item_matrix = None
        
    def load_data(self):
        """Load and preprocess data from database"""
        # In production, this would connect to your PostgreSQL database
        # For now, we'll simulate with sample data
        
        # Sample content data
        self.content_df = pd.DataFrame({
            'content_id': ['1', '2', '3', '4', '5'],
            'title': ['The Matrix', 'Inception', 'Interstellar', 'The Dark Knight', 'Pulp Fiction'],
            'genre': ['Action,Sci-Fi', 'Action,Sci-Fi,Thriller', 'Adventure,Drama,Sci-Fi', 'Action,Crime,Drama', 'Crime,Drama'],
            'description': [
                'A computer programmer discovers reality is a simulation',
                'A thief steals corporate secrets through dream-sharing technology',
                'Explorers travel through a wormhole to ensure humanity survival',
                'Batman faces the Joker in Gotham City',
                'The lives of mob hitmen and others intertwine in tales of violence'
            ],
            'rating': [8.7, 8.8, 8.6, 9.0, 8.9],
            'year': [1999, 2010, 2014, 2008, 1994]
        })
        
        # Sample user-item interactions
        self.interactions_df = pd.DataFrame({
            'user_id': ['user1', 'user1', 'user2', 'user2', 'user3'],
            'content_id': ['1', '2', '3', '4', '5'],
            'rating': [5, 4, 5, 5, 4],
            'watch_time': [120, 140, 160, 145, 150]
        })
        
    def build_content_features(self):
        """Build content-based features using TF-IDF"""
        # Combine genre and description for feature extraction
        content_text = self.content_df['genre'] + ' ' + self.content_df['description']
        self.content_features = self.content_vectorizer.fit_transform(content_text)
        
    def build_collaborative_features(self):
        """Build collaborative filtering features"""
        # Create user-item matrix
        self.user_item_matrix = self.interactions_df.pivot_table(
            index='user_id', 
            columns='content_id', 
            values='rating', 
            fill_value=0
        )
        
        # Apply SVD for dimensionality reduction
        if len(self.user_item_matrix) > 0:
            self.user_factors = self.svd_model.fit_transform(self.user_item_matrix)
            
    def get_content_based_recommendations(self, user_preferences, n_recommendations=10):
        """Generate content-based recommendations"""
        if self.content_features is None:
            self.build_content_features()
            
        # Create user profile based on preferences
        user_genres = user_preferences.get('preferred_genres', [])
        user_profile_text = ' '.join(user_genres)
        
        if not user_profile_text:
            # Return popular content if no preferences
            return self.content_df.nlargest(n_recommendations, 'rating')['content_id'].tolist()
            
        user_profile_vector = self.content_vectorizer.transform([user_profile_text])
        
        # Calculate similarity scores
        similarity_scores = cosine_similarity(user_profile_vector, self.content_features).flatten()
        
        # Get top recommendations
        top_indices = similarity_scores.argsort()[-n_recommendations:][::-1]
        return self.content_df.iloc[top_indices]['content_id'].tolist()
        
    def get_collaborative_recommendations(self, user_id, n_recommendations=10):
        """Generate collaborative filtering recommendations"""
        if self.user_item_matrix is None:
            self.build_collaborative_features()
            
        if user_id not in self.user_item_matrix.index:
            # Return popular content for new users
            return self.content_df.nlargest(n_recommendations, 'rating')['content_id'].tolist()
            
        user_idx = self.user_item_matrix.index.get_loc(user_id)
        user_vector = self.user_factors[user_idx].reshape(1, -1)
        
        # Calculate user similarities
        user_similarities = cosine_similarity(user_vector, self.user_factors).flatten()
        similar_users = user_similarities.argsort()[-6:-1][::-1]  # Top 5 similar users
        
        # Get recommendations from similar users
        recommendations = []
        user_watched = set(self.user_item_matrix.loc[user_id][self.user_item_matrix.loc[user_id] > 0].index)
        
        for similar_user_idx in similar_users:
            similar_user_id = self.user_item_matrix.index[similar_user_idx]
            similar_user_items = self.user_item_matrix.loc[similar_user_id]
            
            for content_id, rating in similar_user_items.items():
                if rating > 3 and content_id not in user_watched and content_id not in recommendations:
                    recommendations.append(content_id)
                    if len(recommendations) >= n_recommendations:
                        break
                        
            if len(recommendations) >= n_recommendations:
                break
                
        return recommendations[:n_recommendations]
        
    def get_hybrid_recommendations(self, user_id, user_preferences, filters=None, n_recommendations=10):
        """Generate hybrid recommendations combining multiple approaches"""
        content_recs = self.get_content_based_recommendations(user_preferences, n_recommendations)
        collab_recs = self.get_collaborative_recommendations(user_id, n_recommendations)
        
        # Combine and weight recommendations
        hybrid_recs = []
        
        # Weight: 60% collaborative, 40% content-based
        for i in range(min(len(collab_recs), int(n_recommendations * 0.6))):
            if collab_recs[i] not in hybrid_recs:
                hybrid_recs.append(collab_recs[i])
                
        for i in range(min(len(content_recs), n_recommendations - len(hybrid_recs))):
            if content_recs[i] not in hybrid_recs:
                hybrid_recs.append(content_recs[i])
                
        # Apply filters if provided
        if filters:
            hybrid_recs = self.apply_filters(hybrid_recs, filters)
            
        return hybrid_recs[:n_recommendations]
        
    def apply_filters(self, recommendations, filters):
        """Apply user filters to recommendations"""
        filtered_recs = []
        
        for content_id in recommendations:
            content = self.content_df[self.content_df['content_id'] == content_id].iloc[0]
            
            # Genre filter
            if filters.get('genre') and filters['genre'] not in content['genre'].lower():
                continue
                
            # Year filter
            if filters.get('year') and str(content['year']) != filters['year']:
                continue
                
            # Rating filter
            if filters.get('rating') and content['rating'] < float(filters['rating']):
                continue
                
            filtered_recs.append(content_id)
            
        return filtered_recs

# Initialize recommendation engine
rec_engine = RecommendationEngine()
rec_engine.load_data()

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    """Main recommendation endpoint"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        rec_type = data.get('type', 'for-you')
        filters = data.get('filters', {})
        user_preferences = data.get('user_preferences', {})
        
        # Check cache first
        cache_key = f"recommendations:{user_id}:{rec_type}:{hash(str(filters))}"
        cached_result = redis_client.get(cache_key)
        
        if cached_result:
            return jsonify(json.loads(cached_result))
            
        # Generate recommendations based on type
        if rec_type == 'for-you':
            recommendations = rec_engine.get_hybrid_recommendations(
                user_id, user_preferences, filters, 20
            )
        elif rec_type == 'trending':
            recommendations = rec_engine.content_df.nlargest(20, 'rating')['content_id'].tolist()
        elif rec_type == 'similar':
            recommendations = rec_engine.get_collaborative_recommendations(user_id, 20)
        elif rec_type == 'new-releases':
            recommendations = rec_engine.content_df.nlargest(20, 'year')['content_id'].tolist()
        else:
            recommendations = rec_engine.get_hybrid_recommendations(
                user_id, user_preferences, filters, 20
            )
            
        # Format response
        result = {
            'forYou': recommendations if rec_type == 'for-you' else [],
            'trending': recommendations if rec_type == 'trending' else [],
            'similar': recommendations if rec_type == 'similar' else [],
            'newReleases': recommendations if rec_type == 'new-releases' else []
        }
        
        # Cache result for 1 hour
        redis_client.setex(cache_key, 3600, json.dumps(result))
        
        return jsonify(result)
        
    except Exception as e:
        logging.error(f"Recommendation error: {str(e)}")
        return jsonify({'error': 'Failed to generate recommendations'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'recommendation'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
