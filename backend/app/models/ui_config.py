from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional
import json
from cryptography.fernet import Fernet
import base64

Base = declarative_base()

class UIConfig(Base):
    __tablename__ = "ui_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), index=True)
    config_key = Column(String(255), index=True)
    encrypted_value = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_locked = Column(Boolean, default=True)
    
    @staticmethod
    def generate_key():
        """Generate encryption key from password"""
        password = "nicolas"
        key = base64.urlsafe_b64encode(password.ljust(32)[:32].encode())
        return key
    
    def encrypt_value(self, value: dict) -> str:
        """Encrypt configuration value"""
        key = self.generate_key()
        f = Fernet(key)
        json_str = json.dumps(value)
        encrypted = f.encrypt(json_str.encode())
        return encrypted.decode()
    
    def decrypt_value(self) -> dict:
        """Decrypt configuration value"""
        key = self.generate_key()
        f = Fernet(key)
        decrypted = f.decrypt(self.encrypted_value.encode())
        return json.loads(decrypted.decode())
    
    def set_config(self, value: dict):
        """Set encrypted configuration value"""
        self.encrypted_value = self.encrypt_value(value)
    
    def get_config(self) -> dict:
        """Get decrypted configuration value"""
        if self.encrypted_value:
            return self.decrypt_value()
        return {}

class UIChangeLog(Base):
    __tablename__ = "ui_change_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), index=True)
    action = Column(String(255))
    config_key = Column(String(255))
    old_value = Column(Text)
    new_value = Column(Text)
    ip_address = Column(String(45))
    user_agent = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    success = Column(Boolean, default=False)
    password_provided = Column(String(255))
    
    def log_change_attempt(self, user_id: str, action: str, config_key: str, 
                          old_value: Optional[str] = None, new_value: Optional[str] = None,
                          ip_address: Optional[str] = None, user_agent: Optional[str] = None,
                          success: bool = False, password_provided: Optional[str] = None):
        """Log UI configuration change attempt"""
        self.user_id = user_id
        self.action = action
        self.config_key = config_key
        self.old_value = old_value
        self.new_value = new_value
        self.ip_address = ip_address
        self.user_agent = user_agent
        self.success = success
        self.password_provided = password_provided
        self.timestamp = datetime.utcnow()
