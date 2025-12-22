from duckduckgo_search import DDGS
from google_play_scraper import search as google_search
import time

def get_web_search_results(query, num_results=10):
    """
    Scrapes Web Search Results using DuckDuckGo.
    Returns list of titles/snippets.
    """
    results = []
    try:
        with DDGS() as ddgs:
            ddg_gen = ddgs.text(query, max_results=num_results)
            if ddg_gen:
                for r in ddg_gen:
                    results.append(f"{r['title']} ({r['href']})")
    except Exception:
        # Silently fail or return empty, do not return error string to UI
        pass
            
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
            
    except Exception:
        pass
        
    return results

def check_visibility(brand_name):
    """
    Aggregates search visibility data.
    """
    # 1. Web Search
    web_res = get_web_search_results(brand_name)
    
    # Pause briefly
    time.sleep(1)
    
    # 2. App Search (Play Store Only - Most reliable)
    play_res = get_play_store_results(brand_name)
    
    # Format for Consumption
    final_web = web_res if web_res else ["Search data unavailable (Manual verification recommended)."]
    final_apps = play_res if play_res else ["No matching apps found in Play Store."]
    
    return {
        "google": final_web,
        "apps": final_apps
    }
