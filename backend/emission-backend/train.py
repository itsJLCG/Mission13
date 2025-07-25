# train.py
import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBRegressor

# Load data
df = pd.read_csv('data.csv')

# Compute average GtCO2
df["avg_gtco2"] = (df["min_gtco2"] + df["max_gtco2"]) / 2

# Label encode categorical fields
le_sector = LabelEncoder()
df["sector_encoded"] = le_sector.fit_transform(df["sector"])

le_cost = LabelEncoder()
df["cost_encoded"] = le_cost.fit_transform(df["cost"])

# Define assumed max total reduction potential
TOTAL_POTENTIAL_GTCO2 = df["avg_gtco2"].sum()

# Assume city emits 10 GtCO2/year for 100% emissions
CITY_EMISSION_GTCO2 = 10
df["percent_reduction"] = (df["avg_gtco2"] / CITY_EMISSION_GTCO2) * 100

# Scale down for tile impact
TOTAL_TILES = 49
df["per_tile_percent"] = df["percent_reduction"] / TOTAL_TILES

# Train model
X = df[["sector_encoded", "avg_gtco2", "cost_encoded"]]
y = df["per_tile_percent"]

model = XGBRegressor()
model.fit(X, y)

# Save everything
joblib.dump(model, "model.pkl")
joblib.dump(le_sector, "sector_encoder.pkl")
joblib.dump(le_cost, "cost_encoder.pkl")
