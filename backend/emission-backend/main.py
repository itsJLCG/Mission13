from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Constants
TOTAL_CITY_EMISSION_GTCO2 = 10  # Total for full 100% emissions
TOTAL_TILES = 49                # 7x7 grid
MAX_REDUCTION_PER_TILE = 5.0    # Maximum 5% reduction per tile

# Load and prepare data
df = pd.read_csv("data.csv")
df["avg_gtco2"] = (df["min_gtco2"] + df["max_gtco2"]) / 2

# Calculate the raw potential of each action
df["raw_potential"] = (df["avg_gtco2"] / TOTAL_CITY_EMISSION_GTCO2) * 100

# Scale to realistic city-level impact with proper distribution
# Map the raw potential to a 0.5-5.0% range based on relative impact
min_raw = df["raw_potential"].min()
max_raw = df["raw_potential"].max()

# Create a scaling function that maps:
# - Lowest impact actions: 0.5% - 1.5% reduction
# - Medium impact actions: 1.5% - 3.0% reduction  
# - High impact actions: 3.0% - 5.0% reduction
def scale_reduction(raw_value, min_val, max_val):
    # Normalize to 0-1 range
    normalized = (raw_value - min_val) / (max_val - min_val)
    
    # Apply a slight curve to make high-impact actions more valuable
    curved = normalized ** 0.8
    
    # Scale to 0.5% - 5.0% range
    scaled = 0.5 + (curved * 4.5)
    
    return min(scaled, MAX_REDUCTION_PER_TILE)

df["reduction_percent"] = df["raw_potential"].apply(
    lambda x: scale_reduction(x, min_raw, max_raw)
)

# Create a dict for quick lookup
action_map = {
    row["action"]: round(row["reduction_percent"], 4)
    for _, row in df.iterrows()
}

# For validation
class ActionRequest(BaseModel):
    action: str

@app.post("/reduction")
def get_reduction(req: ActionRequest):
    action_name = req.action.strip()
    if action_name not in action_map:
        return {
            "error": f"Action '{action_name}' not found. Use /valid-actions to list available actions."
        }
    return {
        "action": action_name,
        "reduction_percent": action_map[action_name]
    }

@app.get("/valid-actions")
def get_valid_actions():
    return {"actions": list(action_map.keys())}

# Debug endpoint to see all values with more info
@app.get("/debug-reductions")
def debug_reductions():
    debug_data = []
    for _, row in df.iterrows():
        debug_data.append({
            "action": row["action"],
            "raw_gtco2_potential": round(row["avg_gtco2"], 4),
            "raw_percent_potential": round(row["raw_potential"], 4),
            "scaled_reduction_percent": round(row["reduction_percent"], 4)
        })
    return {"reductions": debug_data}

# Endpoint to see reduction statistics
@app.get("/reduction-stats")
def reduction_stats():
    reductions = list(action_map.values())
    return {
        "min_reduction": min(reductions),
        "max_reduction": max(reductions),
        "avg_reduction": round(sum(reductions) / len(reductions), 4),
        "total_actions": len(reductions),
        "theoretical_max_if_all_tiles_best": round(max(reductions) * TOTAL_TILES, 2),
        "theoretical_avg_if_all_tiles_filled": round(sum(reductions) / len(reductions) * TOTAL_TILES, 2)
    }