import os
import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
import joblib

# Ensure UTF-8 stdout on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def generate_synthetic_data(n_samples=5000):
    np.random.seed(42)
    
    queue_lengths = np.random.randint(1, 60, size=n_samples)
    active_counters = np.random.choice([2, 3, 4, 5, 6], size=n_samples, p=[0.1, 0.25, 0.45, 0.15, 0.05])
    avg_proc_times = np.random.uniform(4.5, 7.5, size=n_samples)
    crops = np.random.choice(['WHEAT', 'PADDY', 'SOYBEAN', 'COTTON', 'CHANA', 'MAIZE'], size=n_samples)
    hours = np.random.randint(8, 17, size=n_samples)
    days = np.random.randint(0, 6, size=n_samples)
    
    crop_multipliers = {
        'WHEAT': 1.0,
        'PADDY': 1.12,
        'SOYBEAN': 0.95,
        'COTTON': 1.28,
        'CHANA': 0.92,
        'MAIZE': 0.98
    }
    
    waiting_minutes = []
    for q, c, t, cr, hr in zip(queue_lengths, active_counters, avg_proc_times, crops, hours):
        base_wait = (q * t) / max(1, c)
        crop_factor = crop_multipliers.get(cr, 1.0)
        rush_factor = 1.18 if (10 <= hr <= 12) else 1.05 if (13 <= hr <= 14) else 0.95
        noise = np.random.normal(0, 1.5)
        
        final_wait = max(2.0, (base_wait * crop_factor * rush_factor) + noise)
        waiting_minutes.append(round(final_wait, 1))
        
    df = pd.DataFrame({
        'queue_length': queue_lengths,
        'active_counters': active_counters,
        'avg_proc_time': np.round(avg_proc_times, 2),
        'crop_type': crops,
        'hour_of_day': hours,
        'day_of_week': days,
        'waiting_minutes': waiting_minutes
    })
    
    return df

def train_and_save():
    print("[AgriFlow ML] Generating 5,000 synthetic mandi procurement data points...")
    df = generate_synthetic_data(5000)
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'data')
    models_dir = os.path.join(base_dir, 'models')
    
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(models_dir, exist_ok=True)
    
    csv_path = os.path.join(data_dir, 'synthetic_procurement_history.csv')
    df.to_csv(csv_path, index=False)
    
    df_encoded = pd.get_dummies(df, columns=['crop_type'], drop_first=True)
    
    X = df_encoded.drop(columns=['waiting_minutes'])
    y = df_encoded['waiting_minutes']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("[AgriFlow ML] Training Random Forest Regressor on features...")
    model = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42)
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    r2 = r2_score(y_test, preds)
    mae = mean_absolute_error(y_test, preds)
    
    print(f"[AgriFlow ML] Model Performance: R2 Score = {r2:.4f} | MAE = {mae:.2f} minutes")
    
    model_path = os.path.join(models_dir, 'trained_model.joblib')
    joblib.dump(model, model_path)
    
    metadata = {
        'model_type': 'RandomForestRegressor',
        'r2_score': round(float(r2), 4),
        'mae_minutes': round(float(mae), 2),
        'feature_names': list(X.columns),
        'n_estimators': 100,
        'dataset_size': len(df)
    }
    
    meta_path = os.path.join(models_dir, 'model_metadata.json')
    with open(meta_path, 'w') as f:
        json.dump(metadata, f, indent=2)
        
    print("[AgriFlow ML] Model and metadata successfully saved to ml/models/")

if __name__ == '__main__':
    train_and_save()
