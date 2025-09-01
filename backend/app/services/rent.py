from datetime import datetime
from models.cpi_data import cpi_rates

def rent_calculator(old_rent, new_rent, date: datetime, cpi_rates):
    year = date.year
    month = date.month
    illegal_date1 = datetime(2020, 4, 1)
    illegal_date2 = datetime(2023, 10, 1)
    if illegal_date1 <= date <= illegal_date2:
        return {"illegal_period": True, "message": "Any rent raise during this time was illegal"}
    if year not in cpi_rates or month not in cpi_rates[year]:
        return {"error": f"No CPI data available for {year}"}
    cpi_percent = cpi_rates[year][month]
    if cpi_percent is None:
        return {"error": f"There was no CPI data available for this year and month"}
    allowed_rent = old_rent * (1 + cpi_percent)
    overcharge = new_rent - allowed_rent
    overcharge_percent = (overcharge/allowed_rent) * 100
    if overcharge_percent > 0:
        return {"overcharged": True, "message": "You are being overcharged!!!", "overcharge_amount": round(overcharge, 2)}
    else:
        return {"overcharged": False, "message": "You are not being overcharged :)"}