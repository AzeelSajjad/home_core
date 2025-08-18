from datetime import datetime, timedelta    

def rent_calculator(old_rent, new_rent, last_change_date):
    if isinstance(last_change_date, str):
        try:
            last_change_date = datetime.strptime(last_change_date, "%Y-%m-%d")
        except ValueError:
            return {
                "error": True, 
                "message": "Invalid date format. Please use YYYY-MM-DD format."
            }
    
    # Calculate time difference
    current_date = datetime.now()
    time_difference = current_date - last_change_date
    months_passed = time_difference.days / 30.44  # Average days per month
    
    # Check if within 14-month window
    if months_passed > 14:
        return {
            "overcharged": None,
            "message": f"Cannot check overcharge. Last rent change was {months_passed:.1f} months ago, which exceeds the 14-month limit.",
            "months_since_change": round(months_passed, 1)
        }
    
    # Calculate allowed rent increase (4% annually)
    allowed_rent = old_rent * 1.04
    overcharge = new_rent - allowed_rent
    overcharge_percent = (overcharge / allowed_rent) * 100
    
    if overcharge_percent > 0:
        return {
            "overcharged": True,
            "message": "You are being overcharged!!!",
            "overcharge_amount": round(overcharge, 2),
            "overcharge_percent": round(overcharge_percent, 2),
            "months_since_change": round(months_passed, 1)
        }
    else:
        return {
            "overcharged": False,
            "message": "You are not being overcharged :)",
            "months_since_change": round(months_passed, 1)
        }
