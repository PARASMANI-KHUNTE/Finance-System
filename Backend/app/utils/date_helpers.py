from datetime import datetime
from typing import Optional

def parse_date(date_str: Optional[str]) -> Optional[datetime]:
    """
    Parses an ISO formatted date string into a datetime object.
    Useful for robust date filtering.
    """
    if not date_str:
        return None
    try:
        # Tries standard ISO format
        return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except ValueError:
        raise ValueError(f"Invalid date format: {date_str}. Expected ISO 8601.")

def get_month_str(date_obj: datetime) -> str:
    """
    Returns the YYYY-MM representation of a datetime object,
    used for aggregating monthly summaries.
    """
    return date_obj.strftime("%Y-%m")
