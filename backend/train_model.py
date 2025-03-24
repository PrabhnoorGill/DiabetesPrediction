from sklearn.ensemble import RandomForestClassifier
import numpy as np
import joblib

# Create a simple dummy dataset for demonstration
# In reality, you would use real diabetes data to train your model
def create_dummy_data(n_samples=1000):
    np.random.seed(42)
    X = np.random.rand(n_samples, 18)  # 18 features matching our input
    # Create target variable with some relationship to features
    y = (X.sum(axis=1) > 9).astype(int)
    return X, y

def train_and_save_model():
    # Create dummy data
    X, y = create_dummy_data()
    
    # Train a simple random forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save the model
    joblib.dump(model, 'diabetes_model.pkl')
    print("Model trained and saved as 'diabetes_model.pkl'")

if __name__ == "__main__":
    train_and_save_model() 