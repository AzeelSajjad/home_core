from datetime import datetime, timedelta    

def rent_calculator(old_rent, new_rent):
    allowed_rent = old_rent * 1.04
    overcharge = new_rent - allowed_rent
    overcharge_percent = (overcharge/allowed_rent) * 100
    if overcharge_percent > 0:
        return {"overcharged": True, "message": "You are being overcharged!!!", "overcharge_amount": round(overcharge, 2)}
    else:
        return {"overcharged": False, "message": "You are not being overcharged :)"}