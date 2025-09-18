from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, List
import logging
from twilio.rest import Client
import os

SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

class AuthService:
    def __init__(self):
        self.twilio_client = None
        try:
            account_sid = os.getenv("TWILIO_ACCOUNT_SID")
            auth_token = os.getenv("TWILIO_AUTH_TOKEN")
            if account_sid and auth_token:
                self.twilio_client = Client(account_sid, auth_token)
        except Exception as e:
            logging.warning(f"Twilio client initialization failed: {e}")
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def verify_token(self, credentials: HTTPAuthorizationCredentials = Depends(security)):
        """Verify JWT token"""
        try:
            payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            return {"user_id": user_id, "permissions": payload.get("permissions", [])}
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    def verify_ui_password(self, password: str) -> bool:
        """Verify UI configuration password"""
        return password == "nicolas"
    
    def send_admin_notification(self, message: str, phone_number: str = "+27812220127"):
        """Send SMS notification to admin"""
        if not self.twilio_client:
            logging.warning("Twilio client not configured, cannot send SMS")
            return False
        
        try:
            message_obj = self.twilio_client.messages.create(
                body=message,
                from_=os.getenv("TWILIO_PHONE_NUMBER"),
                to=phone_number
            )
            logging.info(f"SMS sent successfully: {message_obj.sid}")
            return True
        except Exception as e:
            logging.error(f"Failed to send SMS: {e}")
            return False
    
    def log_failed_ui_access(self, user_id: str, ip_address: str, action: str):
        """Log failed UI access attempt and notify admin"""
        log_message = f"Failed UI access attempt - User: {user_id}, IP: {ip_address}, Action: {action}, Time: {datetime.utcnow()}"
        logging.warning(log_message)
        
        sms_message = f"BRETT UI Security Alert: Failed access attempt from {ip_address} at {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}"
        self.send_admin_notification(sms_message)
    
    def check_permissions(self, required_permissions: List[str], user_permissions: List[str]) -> bool:
        """Check if user has required permissions"""
        return all(perm in user_permissions for perm in required_permissions)

auth_service = AuthService()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    return auth_service.verify_token(credentials)

def require_permissions(required_permissions: List[str]):
    """Decorator to require specific permissions"""
    def permission_checker(current_user: dict = Depends(get_current_user)):
        user_permissions = current_user.get("permissions", [])
        if not auth_service.check_permissions(required_permissions, user_permissions):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return permission_checker
