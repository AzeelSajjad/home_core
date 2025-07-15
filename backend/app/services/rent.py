def rent_calculator(old_rent, new_rent):
    allowed_rent = old_rent * 1.04
    overcharge = new_rent - allowed_rent
    overcharge_percent = (overcharge/allowed_rent) * 100
    if(overcharge_percent > 0.00):
        return print("You are being overcharged!!!")
    else:
        return print("You are not being overcharged :)")
    
