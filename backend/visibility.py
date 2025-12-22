from googlesearch import search
from app_store_scraper import AppStore
from google_play_scraper import app, Sort, search as google_search
import time
import random

def get_google_search_results(query, num_results=10):
    """
    Scrapes Google Search Results.
    Returns list of titles/snippets.
    """
    results = []
    try:
        # googlesearch-python returns URLs. It doesn't give titles easily without fetching.
        # But `googlesearch-python` (the new one) has extended properties in some versions, 
        # or we might just get URLs.
        # Actually, standard `googlesearch` only yields URLs.
        # To get titles, we'd need to visit. That's too slow/risky.
        # Let's try to infer from URL or just pass URLs to LLM.
        # Wait, the user wants "Top 10 Google Search Results".
        # Providing URLs is often enough for LLM to identify brands (e.g. facebook.com, imdb.com).
        
        # Let's see if we can get more info. 
        # If we use `googlesearch-python`, `search(..., advanced=True)` yields objects with title/description!
        # Let's check installed version capability.
        
        for result in search(query, num_results=num_results, advanced=True):
            results.append(f"{result.title} ({result.url}): {result.description}")
            
    except Exception as e:
        results.append(f"Google Search Error: {str(e)}")
        # Fallback to URLs only if advanced fails
        try:
            for url in search(query, num_results=num_results):
                results.append(url)
        except:
            pass
            
    return results

def get_app_store_results(query):
    """
    Searches Apple App Store (US).
    Returns list of app names.
    """
    results = []
    try:
        # Check US store
        us_store = AppStore(country='us', app_name=query)
        us_store.search(query)
        
        for app in us_store.search_results[:5]:
            results.append(f"{app['trackName']} (Developer: {app['artistName']})")
            
    except Exception as e:
        results.append(f"App Store Error: {str(e)}")
        
    return results

def get_play_store_results(query):
    """
    Searches Google Play Store.
    """
    results = []
    try:
        res = google_search(
            query,
            lang='en',
            country='us',
            n_hits=5
        )
        
        for app in res:
            results.append(f"{app['title']} (Developer: {app['developer']})")
            
    except Exception as e:
        results.append(f"Play Store Error: {str(e)}")
        
    return results

def check_visibility(brand_name):
    """
    Aggregates search visibility data.
    """
    google_res = get_google_search_results(brand_name)
    
    # Pause briefly to be polite
    time.sleep(1)
    
    app_res = get_app_store_results(brand_name)
    play_res = get_play_store_results(brand_name)
    
    combined_apps = app_res + play_res
    
    return {
        "google": google_res,
        "apps": combined_apps
    }
