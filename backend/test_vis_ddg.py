from visibility import check_visibility
import sys

try:
    print("Testing visibility for 'Apple'...")
    res = check_visibility("Apple")
    print("Web Results (First 3):")
    for r in res['google'][:3]:
        print(" -", r[:100] + "...")
    
    print("\nApp Results (First 3):")
    for r in res['apps'][:3]:
        print(" -", r)
        
except Exception as e:
    print("Error:", e)
