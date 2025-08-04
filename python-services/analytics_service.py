"""
Netflix Clone - Analytics Microservice
Handles data processing, user behavior analysis, and performance metrics.
"""

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import redis
import json
import os
import logging
from collections import defaultdict

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Redis for caching
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    decode_responses=True
)

class AnalyticsEngine:
    def __init__(self):
        self.load_sample_data()
        
    def load_sample_data(self):
        """Load sample analytics data"""
        # Generate sample user activity data
        dates = pd.date_range(start='2024-01-01', end='2024-01-31', freq='D')
        
        self.user_activity = pd.DataFrame({
            'date': dates,
            'users': np.random.randint(1000, 5000, len(dates)),
            'sessions': np.random.randint(1500, 7500, len(dates)),
            'page_views': np.random.randint(5000, 25000, len(dates)),
            'watch_time_hours': np.random.randint(2000, 10000, len(dates))
        })
        
        # Sample content performance data
        self.content_performance = pd.DataFrame({
            'content_id': ['1', '2', '3', '4', '5'],
            'title': ['The Matrix', 'Inception', 'Interstellar', 'The Dark Knight', 'Pulp Fiction'],
            'views': [15000, 12000, 18000, 22000, 8000],
            'unique_viewers': [12000, 9500, 14000, 18000, 6500],
            'avg_watch_time': [95, 88, 92, 98, 85],
            'completion_rate': [0.78, 0.82, 0.75, 0.85, 0.72],
            'rating': [8.7, 8.8, 8.6, 9.0, 8.9]
        })
        
        # Sample device/platform data
        self.device_data = pd.DataFrame({
            'device_type': ['Desktop', 'Mobile', 'Tablet', 'Smart TV', 'Gaming Console'],
            'users': [3500, 4200, 1800, 2100, 800],
            'sessions': [5200, 6800, 2400, 3100, 1200],
            'avg_session_duration': [45, 32, 38, 52, 48]
        })
        
    def get_overview_metrics(self, time_range='7d'):
        """Get high-level overview metrics"""
        # Calculate date range
        end_date = datetime.now()
        if time_range == '24h':
            start_date = end_date - timedelta(hours=24)
        elif time_range == '7d':
            start_date = end_date - timedelta(days=7)
        elif time_range == '30d':
            start_date = end_date - timedelta(days=30)
        else:
            start_date = end_date - timedelta(days=90)
            
        # Filter data by date range
        filtered_data = self.user_activity[
            (self.user_activity['date'] >= start_date) & 
            (self.user_activity['date'] <= end_date)
        ]
        
        return {
            'totalUsers': int(filtered_data['users'].sum()),
            'activeUsers': int(filtered_data['users'].mean()),
            'totalViews': int(self.content_performance['views'].sum()),
            'avgWatchTime': int(self.content_performance['avg_watch_time'].mean()),
            'userGrowth': 12.5,  # Mock growth percentage
            'engagementRate': 78.3  # Mock engagement rate
        }
        
    def get_user_behavior_data(self, time_range='7d'):
        """Get user behavior analytics"""
        # Daily activity data
        daily_activity = []
        for _, row in self.user_activity.tail(30).iterrows():
            daily_activity.append({
                'date': row['date'].strftime('%Y-%m-%d'),
                'users': int(row['users']),
                'sessions': int(row['sessions'])
            })
            
        # Device distribution
        device_types = []
        for _, row in self.device_data.iterrows():
            device_types.append({
                'name': row['device_type'],
                'value': int(row['users'])
            })
            
        # Hourly watch patterns (mock data)
        watch_patterns = []
        for hour in range(24):
            # Simulate peak viewing times
            if 19 <= hour <= 23:  # Prime time
                views = np.random.randint(800, 1200)
            elif 12 <= hour <= 14:  # Lunch time
                views = np.random.randint(400, 600)
            else:
                views = np.random.randint(100, 400)
                
            watch_patterns.append({
                'hour': hour,
                'views': views
            })
            
        return {
            'dailyActivity': daily_activity,
            'deviceTypes': device_types,
            'watchPatterns': watch_patterns
        }
        
    def get_content_performance_data(self):
        """Get content performance analytics"""
        # Top performing content
        top_content = []
        for _, row in self.content_performance.iterrows():
            top_content.append({
                'title': row['title'],
                'views': int(row['views']),
                'rating': float(row['rating'])
            })
            
        # Genre performance (mock data)
        genre_performance = [
            {'genre': 'Action', 'views': 45000, 'engagement': 82},
            {'genre': 'Drama', 'views': 38000, 'engagement': 78},
            {'genre': 'Comedy', 'views': 32000, 'engagement': 85},
            {'genre': 'Sci-Fi', 'views': 28000, 'engagement': 79},
            {'genre': 'Thriller', 'views': 25000, 'engagement': 81}
        ]
        
        return {
            'topContent': top_content,
            'genrePerformance': genre_performance
        }
        
    def get_recommendation_metrics(self):
        """Get recommendation system performance metrics"""
        return {
            'accuracy': 78.5,
            'clickThroughRate': 12.3,
            'conversionRate': 8.7,
            'algorithmPerformance': [
                {'algorithm': 'Collaborative Filtering', 'accuracy': 76.2, 'usage': 40},
                {'algorithm': 'Content-Based', 'accuracy': 72.8, 'usage': 35},
                {'algorithm': 'Hybrid', 'accuracy': 81.3, 'usage': 25}
            ]
        }

# Initialize analytics engine
analytics_engine = AnalyticsEngine()

@app.route('/analytics', methods=['POST'])
def get_analytics():
    """Main analytics endpoint"""
    try:
        data = request.get_json()
        time_range = data.get('time_range', '7d')
        user_id = data.get('user_id')
        
        # Check cache
        cache_key = f"analytics:{time_range}:{user_id}"
        cached_result = redis_client.get(cache_key)
        
        if cached_result:
            return jsonify(json.loads(cached_result))
            
        # Generate analytics data
        result = {
            'overview': analytics_engine.get_overview_metrics(time_range),
            'userBehavior': analytics_engine.get_user_behavior_data(time_range),
            'contentPerformance': analytics_engine.get_content_performance_data(),
            'recommendations': analytics_engine.get_recommendation_metrics()
        }
        
        # Cache for 15 minutes
        redis_client.setex(cache_key, 900, json.dumps(result))
        
        return jsonify(result)
        
    except Exception as e:
        logging.error(f"Analytics error: {str(e)}")
        return jsonify({'error': 'Failed to fetch analytics'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'analytics'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8002, debug=True)
