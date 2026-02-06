# model.py
def predict_crop_yield(rainfall, temperature, soil_quality):
    """
    A simple example function that predicts crop yield.
    Inputs are numeric values.
    """
    # Simple formula (just for demonstration)
    yield_prediction = (rainfall * 0.5 + temperature * 0.3 + soil_quality * 0.2)
    return round(yield_prediction, 2)
