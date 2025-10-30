from django.core.mail import EmailMultiAlternatives, EmailMessage
from django.conf import settings
from django.utils.html import strip_tags


def get_email_base_template(content, title="Rentify"):
    """Wraps content in a consistent email HTML layout"""
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
        <style>
            body {{
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
            }}
            .email-container {{
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }}
            .email-header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
                text-align: center;
                color: white;
            }}
            .email-body {{
                padding: 40px 30px;
                color: #333333;
                line-height: 1.6;
            }}
            .email-footer {{
                background-color: #f9f9f9;
                padding: 30px;
                text-align: center;
                color: #666666;
                font-size: 14px;
                border-top: 1px solid #e0e0e0;
            }}
            .button {{
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white !important;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 20px 0;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }}
            .info-box {{
                background-color: #f0f4ff;
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
            }}
            .success-box {{
                background-color: #f0fdf4;
                border-left: 4px solid #10b981;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
            }}
            .warning-box {{
                background-color: #fffbeb;
                border-left: 4px solid #f59e0b;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
            }}
            .detail-row {{
                padding: 12px 0;
                border-bottom: 1px solid #e5e7eb;
            }}
            .detail-label {{
                font-weight: 600;
                color: #667eea;
                display: inline-block;
                width: 140px;
            }}
            .detail-value {{
                color: #333333;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-body">
                {content}
            </div>
        </div>
    </body>
    </html>
    """


def send_html_email(subject, html_content, recipient_list):
    """
    Send an HTML email using Django's EmailMultiAlternatives
    """
    text_content = strip_tags(html_content)
    
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=recipient_list
    )
    email.attach_alternative(html_content, "text/html")
    email.send(fail_silently=False)


# ============================================
# AUTHENTICATION EMAIL FUNCTIONS
# ============================================

def send_verification_email(user, verification_link):
    """Send account verification or resend verification email"""
    content = f"""
        <h2 style="color: #667eea;">✅ Verify Your Rentify Account</h2>
        <p>Hi {user.user_name or user.email},</p>
        <p>Click the button below to verify your email address:</p>
        <div style="text-align:center;">
            <a href="{verification_link}" class="button">Verify Email</a>
        </div>
        <p style="color:#666;">If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="{verification_link}" style="color:#667eea; word-break:break-all;">{verification_link}</a></p>
        <p style="color:#999;">This link will expire in 24 hours. If you didn't sign up, please ignore this email.</p>
    """
    html_content = get_email_base_template(content, title="Verify Your Email")
    subject = "✅ Verify your Rentify account"
    
    try:
        send_html_email(subject, html_content, [user.email])
        print(f"✅ Verification email sent to {user.email}")
    except Exception as e:
        print(f"❌ Failed to send verification email: {e}")
        raise


def send_password_reset_email(user, reset_link):
    """Send password reset email"""
    content = f"""
        <h2 style="color: #667eea;">🔒 Reset Your Password</h2>
        <p>Hi {user.user_name or user.email},</p>
        <p>We received a request to reset your Rentify account password.</p>
        <div class="warning-box">
            <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
        </div>
        <div style="text-align:center;">
            <a href="{reset_link}" class="button">Reset My Password</a>
        </div>
        <p style="color:#666;">If the button doesn't work, copy and paste this link:<br>
        <a href="{reset_link}" style="color:#667eea; word-break:break-all;">{reset_link}</a></p>
        <p style="color:#999;">This link will expire in 1 hour.</p>
    """
    html_content = get_email_base_template(content, "Reset Your Password")
    subject = "🔒 Reset your Rentify password"
    
    try:
        send_html_email(subject, html_content, [user.email])
        print(f"✅ Password reset email sent to {user.email}")
    except Exception as e:
        print(f"❌ Failed to send password reset email: {e}")
        raise


def send_password_changed_confirmation(user):
    """Send confirmation email after password change"""
    content = f"""
        <h2 style="color: #10b981;">✅ Password Changed Successfully</h2>
        <p>Hi {user.user_name or user.email},</p>
        <p>Your Rentify account password has been changed successfully.</p>
        <div class="success-box">
            <p><strong>Account:</strong> {user.email}</p>
            <p><strong>Changed:</strong> Just now</p>
        </div>
        <div class="warning-box" style="margin-top:20px;">
            <p>If you didn't change your password, contact support immediately.</p>
        </div>
        <div style="text-align:center; margin:30px 0;">
            <a href="{settings.FRONTEND_URL}/login" class="button">Log In to Your Account</a>
        </div>
        <p style="color:#666;">For security reasons, you may need to log in again on all devices.</p>
    """
    html_content = get_email_base_template(content, "Password Changed")
    subject = "✅ Your Rentify password has been changed"
    
    try:
        send_html_email(subject, html_content, [user.email])
        print(f"✅ Password changed confirmation sent to {user.email}")
    except Exception as e:
        print(f"❌ Failed to send password changed confirmation: {e}")


# ============================================
# BOOKING EMAIL FUNCTIONS
# ============================================

def notify_admin_booking_requested(booking):
    """Email to admin when new booking is created"""
    content = f"""
        <h2 style="color: #667eea; margin-bottom: 10px;">🔔 New Booking Request</h2>
        <p>A new booking request has been submitted and requires your attention.</p>
        
        <div class="info-box">
            <h3 style="margin-top: 0; color: #667eea;">Booking Details</h3>
            <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">#{booking.pk}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value">{booking.item.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Renter:</span>
                <span class="detail-value">{booking.renter.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Owner:</span>
                <span class="detail-value">{booking.owner.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Rental Period:</span>
                <span class="detail-value">{booking.start_date} to {booking.end_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Price:</span>
                <span class="detail-value">₹{booking.total_price or 'Calculating...'}</span>
            </div>
        </div>
        
        <div style="text-align:center; margin:30px 0;">
            <a href="{settings.FRONTEND_URL}/admin/bookings/{booking.pk}/" class="button">
                View in Admin Panel
            </a>
        </div>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
            This is an automated notification from your Rentify platform.
        </p>
    """
    
    html_content = get_email_base_template(content, "New Booking Request")
    subject = f"🔔 New Booking Request #{booking.pk}"
    
    admins = [a[1] for a in settings.ADMINS] if getattr(settings, 'ADMINS', None) else []
    if admins:
        try:
            send_html_email(subject, html_content, admins)
            print(f"✅ Admin notification sent for booking #{booking.pk}")
        except Exception as e:
            print(f"❌ Failed to notify admin: {e}")


def notify_owner_booking_requested(booking):
    """Email to owner when someone requests to rent their item"""
    renter_name = getattr(booking.renter, 'user_name', None) or booking.renter.email
    
    content = f"""
        <h2 style="color: #667eea; margin-bottom: 10px;">🎉 New Rental Request!</h2>
        <p>Great news! Someone wants to rent your item.</p>
        
        <div class="info-box">
            <h3 style="margin-top: 0; color: #667eea;">📦 Item Details</h3>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value"><strong>{booking.item.name}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Price per Day:</span>
                <span class="detail-value">₹{booking.item.price_per_day}</span>
            </div>
        </div>
        
        <div class="success-box">
            <h3 style="margin-top: 0; color: #10b981;">👤 Renter Information</h3>
            <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">{renter_name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{booking.renter.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Rental Period:</span>
                <span class="detail-value">{booking.start_date} to {booking.end_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value"><strong>₹{booking.total_price}</strong></span>
            </div>
        </div>
        
        {f'<div class="warning-box"><strong>📝 Renters Note:</strong><p style="margin: 10px 0 0 0;">{booking.renter_note}</p></div>' if getattr(booking, 'renter_note', None) else ''}
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{settings.FRONTEND_URL}/orders" class="button">
                Review & Accept Request
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>What's Next?</strong><br>
            • Review the booking details<br>
            • Accept or decline the request<br>
            • Your item will be marked as unavailable once you accept
        </p>
    """
    
    html_content = get_email_base_template(content, "New Rental Request")
    subject = f"🎉 Someone wants to rent your {booking.item.name}!"
    
    try:
        send_html_email(subject, html_content, [booking.owner.email])
        print(f"✅ Owner notification sent to {booking.owner.email}")
    except Exception as e:
        print(f"❌ Failed to notify owner: {e}")
        raise


def notify_renter_booking_created(booking):
    """Email to renter confirming their booking request"""
    content = f"""
        <h2 style="color: #667eea; margin-bottom: 10px;">✅ Booking Request Submitted</h2>
        <p>Your rental request has been successfully submitted!</p>
        
        <div class="success-box">
            <h3 style="margin-top: 0; color: #10b981;">📋 Booking Summary</h3>
            <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">#{booking.pk}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value"><strong>{booking.item.name}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Rental Period:</span>
                <span class="detail-value">{booking.start_date} to {booking.end_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value"><strong>₹{booking.total_price}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value" style="color: #f59e0b; font-weight: bold;">⏳ Pending Owner Approval</span>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{settings.FRONTEND_URL}/orders" class="button">
                View My Bookings
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>What Happens Next?</strong><br>
            • The owner will review your request<br>
            • You'll receive an email once they respond<br>
            • You can track your booking status in your orders page
        </p>
    """
    
    html_content = get_email_base_template(content, "Booking Confirmed")
    subject = f"✅ Your booking request for {booking.item.name} has been submitted"
    
    try:
        send_html_email(subject, html_content, [booking.renter.email])
        print(f"✅ Renter confirmation sent to {booking.renter.email}")
    except Exception as e:
        print(f"❌ Failed to notify renter: {e}")
        raise


def notify_renter_owner_accepted(booking):
    """Email to renter when owner accepts the booking"""
    owner_name = getattr(booking.owner, 'user_name', None) or booking.owner.email
    
    content = f"""
        <h2 style="color: #10b981; margin-bottom: 10px;">🎉 Booking Accepted!</h2>
        <p>Great news! The owner has accepted your rental request.</p>
        
        <div class="success-box">
            <h3 style="margin-top: 0; color: #10b981;">✅ Booking Confirmed</h3>
            <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">#{booking.pk}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value"><strong>{booking.item.name}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Owner:</span>
                <span class="detail-value">{owner_name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Rental Period:</span>
                <span class="detail-value">{booking.start_date} to {booking.end_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value"><strong>₹{booking.total_price}</strong></span>
            </div>
        </div>
        
        {f'<div class="info-box"><strong>💬 Message from Owner:</strong><p style="margin: 10px 0 0 0;">{booking.owner_note}</p></div>' if getattr(booking, 'owner_note', None) else ''}
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{settings.FRONTEND_URL}/orders" class="button">
                Confirm Your Booking
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>⚠ Important - Action Required:</strong><br>
            Please confirm this booking within 24 hours to proceed with the rental.
        </p>
    """
    
    html_content = get_email_base_template(content, "Booking Accepted")
    subject = f"🎉 Your booking for {booking.item.name} has been accepted!"
    
    try:
        send_html_email(subject, html_content, [booking.renter.email])
        print(f"✅ Owner acceptance notification sent to {booking.renter.email}")
    except Exception as e:
        print(f"❌ Failed to notify renter: {e}")
        raise


def notify_owner_renter_confirmed(booking):
    """Email to owner when renter confirms the booking"""
    renter_name = getattr(booking.renter, 'user_name', None) or booking.renter.email
    
    content = f"""
        <h2 style="color: #10b981; margin-bottom: 10px;">✅ Renter Confirmed!</h2>
        <p>The renter has confirmed the booking. Your item is now officially rented.</p>
        
        <div class="success-box">
            <h3 style="margin-top: 0; color: #10b981;">📦 Active Rental</h3>
            <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">#{booking.pk}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value"><strong>{booking.item.name}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Renter:</span>
                <span class="detail-value">{renter_name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{booking.renter.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Rental Period:</span>
                <span class="detail-value">{booking.start_date} to {booking.end_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">You'll Receive:</span>
                <span class="detail-value"><strong style="color: #10b981;">₹{booking.total_price}</strong></span>
            </div>
        </div>
        
        {f'<div class="warning-box"><strong>🚚 Third-Party Logistics Required</strong><p style="margin: 10px 0 0 0;">Please arrange delivery/pickup logistics for this rental.</p></div>' if getattr(booking, 'third_party_required', False) else ''}
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{settings.FRONTEND_URL}/orders" class="button">
                Manage This Rental
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>Next Steps:</strong><br>
            • Coordinate handover with the renter<br>
            • Ensure item is in good condition<br>
            • Mark as completed after rental period ends
        </p>
    """
    
    html_content = get_email_base_template(content, "Renter Confirmed")
    subject = f"✅ Rental confirmed for your {booking.item.name}"
    
    try:
        send_html_email(subject, html_content, [booking.owner.email])
        print(f"✅ Renter confirmation notification sent to {booking.owner.email}")
    except Exception as e:
        print(f"❌ Failed to notify owner: {e}")
        raise


def notify_booking_cancelled(booking, cancelled_by_role, reason=""):
    """Email to both parties when booking is cancelled"""
    cancel_person = "owner" if cancelled_by_role == "owner" else "renter"
    recipient = booking.renter if cancelled_by_role == "owner" else booking.owner
    
    content = f"""
        <h2 style="color: #ef4444; margin-bottom: 10px;">❌ Booking Cancelled</h2>
        <p>This booking has been cancelled by the {cancel_person}.</p>
        
        <div class="warning-box">
            <h3 style="margin-top: 0; color: #f59e0b;">📋 Booking Details</h3>
            <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">#{booking.pk}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value">{booking.item.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Was Scheduled:</span>
                <span class="detail-value">{booking.start_date} to {booking.end_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value" style="color: #ef4444; font-weight: bold;">❌ Cancelled</span>
            </div>
        </div>
        
        {f'<div class="info-box"><strong>💬 Cancellation Reason:</strong><p style="margin: 10px 0 0 0;">{reason}</p></div>' if reason else ''}
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            The item is now available again for other bookings. No charges have been applied.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{settings.FRONTEND_URL}/items" class="button">
                Browse Other Items
            </a>
        </div>
    """
    
    html_content = get_email_base_template(content, "Booking Cancelled")
    subject = f"❌ Booking cancelled for {booking.item.name}"
    
    try:
        send_html_email(subject, html_content, [recipient.email])
        print(f"✅ Cancellation notification sent to {recipient.email}")
    except Exception as e:
        print(f"❌ Failed to send cancellation email: {e}")


def notify_booking_completed(booking):
    """Email to both parties when booking is completed"""
    content_renter = f"""
        <h2 style="color: #10b981; margin-bottom: 10px;">✅ Rental Completed</h2>
        <p>Thank you for using Rentify! Your rental has been successfully completed.</p>
        
        <div class="success-box">
            <h3 style="margin-top: 0; color: #10b981;">📦 Rental Summary</h3>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value">{booking.item.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Rental Period:</span>
                <span class="detail-value">{booking.start_date} to {booking.end_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Paid:</span>
                <span class="detail-value"><strong>₹{booking.total_price}</strong></span>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{settings.FRONTEND_URL}/items/{booking.item.pk}" class="button">
                Rate This Item
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            We hope you had a great experience! Browse more items on Rentify.
        </p>
    """
    
    content_owner = f"""
        <h2 style="color: #10b981; margin-bottom: 10px;">✅ Rental Completed</h2>
        <p>The rental period for your item has ended successfully!</p>
        
        <div class="success-box">
            <h3 style="margin-top: 0; color: #10b981;">💰 Earnings Summary</h3>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value">{booking.item.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Rental Period:</span>
                <span class="detail-value">{booking.start_date} to {booking.end_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">You Earned:</span>
                <span class="detail-value"><strong style="color: #10b981; font-size: 24px;">₹{booking.total_price}</strong></span>
            </div>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Your item is now available for new bookings. Keep earning with Rentify!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{settings.FRONTEND_URL}/orders" class="button">
                View My Earnings
            </a>
        </div>
    """
    
    html_renter = get_email_base_template(content_renter, "Rental Completed")
    html_owner = get_email_base_template(content_owner, "Rental Completed")
    subject = f"✅ Rental completed - {booking.item.name}"
    
    try:
        send_html_email(subject, html_renter, [booking.renter.email])
        send_html_email(subject, html_owner, [booking.owner.email])
        print(f"✅ Completion notifications sent to both parties")
    except Exception as e:
        print(f"❌ Failed to send completion emails: {e}")


def notify_booking_extended(booking, days_extended):
    """Email when booking period is extended"""
    content = f"""
        <h2 style="color: #667eea; margin-bottom: 10px;">⏰ Rental Period Extended</h2>
        <p>The rental period has been extended by <strong>{days_extended} days</strong>.</p>
        
        <div class="info-box">
            <h3 style="margin-top: 0; color: #667eea;">📅 Updated Schedule</h3>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value">{booking.item.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">New End Date:</span>
                <span class="detail-value"><strong style="color: #667eea;">{booking.end_date}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Extended By:</span>
                <span class="detail-value"><strong>{days_extended} days</strong></span>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{settings.FRONTEND_URL}/orders" class="button">
                View Booking Details
            </a>
        </div>
    """
    
    html_content = get_email_base_template(content, "Booking Extended")
    subject = f"⏰ Rental period extended - {booking.item.name}"
    
    try:
        send_html_email(subject, html_content, [booking.renter.email, booking.owner.email])
        print(f"✅ Extension notifications sent to both parties")
    except Exception as e:
        print(f"❌ Failed to send extension email: {e}")


# ============================================
# REMINDER EMAIL FUNCTIONS
# ============================================

def send_rental_reminder(booking, days_until):
    """Reminder email before rental starts"""
    content = f"""
        <h2 style="color: #667eea; margin-bottom: 10px;">⏰ Rental Reminder</h2>
        <p>Your rental period starts in <strong>{days_until} days</strong>!</p>
        
        <div class="info-box">
            <h3 style="margin-top: 0; color: #667eea;">📅 Upcoming Rental</h3>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value"><strong>{booking.item.name}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Start Date:</span>
                <span class="detail-value">{booking.start_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">End Date:</span>
                <span class="detail-value">{booking.end_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Owner Contact:</span>
                <span class="detail-value">{booking.owner.email}</span>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{settings.FRONTEND_URL}/orders" class="button">
                View Booking Details
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>Checklist:</strong><br>
            ✓ Confirm pickup arrangements with the owner<br>
            ✓ Prepare payment if not done already<br>
            ✓ Review item condition notes
        </p>
    """
    
    html_content = get_email_base_template(content, "Rental Reminder")
    subject = f"⏰ Your rental starts in {days_until} days - {booking.item.name}"
    
    try:
        send_html_email(subject, html_content, [booking.renter.email])
        print(f"✅ Rental reminder sent to {booking.renter.email}")
    except Exception as e:
        print(f"❌ Failed to send rental reminder: {e}")


def send_return_reminder(booking, days_until):
    """Reminder email before rental ends"""
    content = f"""
        <h2 style="color: #f59e0b; margin-bottom: 10px;">⏰ Return Reminder</h2>
        <p>Your rental period ends in <strong>{days_until} days</strong>. Please prepare to return the item.</p>
        
        <div class="warning-box">
            <h3 style="margin-top: 0; color: #f59e0b;">📦 Return Details</h3>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value"><strong>{booking.item.name}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Return Date:</span>
                <span class="detail-value"><strong>{booking.end_date}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Owner Contact:</span>
                <span class="detail-value">{booking.owner.email}</span>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{settings.FRONTEND_URL}/orders" class="button">
                View Booking Details
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>Before returning:</strong><br>
            ✓ Clean the item if required<br>
            ✓ Check for any damage<br>
            ✓ Coordinate return time with owner<br>
            ✓ Need more time? Request an extension
        </p>
        
        <div class="info-box" style="margin-top: 20px;">
            <p style="margin: 0;">
                💡 <strong>Need to extend?</strong> You can request an extension through your orders page.
            </p>
        </div>
    """
    
    html_content = get_email_base_template(content, "Return Reminder")
    subject = f"⏰ Return reminder: {booking.item.name} - {days_until} days left"
    
    try:
        send_html_email(subject, html_content, [booking.renter.email])
        print(f"✅ Return reminder sent to {booking.renter.email}")
    except Exception as e:
        print(f"❌ Failed to send return reminder: {e}")


def send_overdue_notification(booking):
    """Notification when rental is overdue"""
    content = f"""
        <h2 style="color: #ef4444; margin-bottom: 10px;">🚨 Rental Overdue</h2>
        <p>The rental period has ended. Please return the item immediately.</p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #ef4444;">⚠ Urgent Action Required</h3>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value"><strong>{booking.item.name}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Was Due:</span>
                <span class="detail-value" style="color: #ef4444; font-weight: bold;">{booking.end_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Owner:</span>
                <span class="detail-value">{booking.owner.email}</span>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{settings.FRONTEND_URL}/orders" class="button" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                Contact Owner Now
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>Important:</strong><br>
            • Late fees may apply<br>
            • Please contact the owner immediately<br>
            • Return the item as soon as possible
        </p>
    """
    
    html_content = get_email_base_template(content, "Rental Overdue")
    subject = f"🚨 URGENT: Rental overdue - {booking.item.name}"
    
    try:
        # Send to renter
        send_html_email(subject, html_content, [booking.renter.email])
        
        # Also notify owner
        owner_content = content.replace(
            "Please return the item immediately",
            "The renter has not returned the item yet."
        )
        owner_html = get_email_base_template(owner_content, "Rental Overdue")
        send_html_email(subject, owner_html, [booking.owner.email])
        
        print(f"✅ Overdue notifications sent to both parties")
    except Exception as e:
        print(f"❌ Failed to send overdue notification: {e}")


def notify_third_party(booking, provider=None, details=None):
    """Notification for logistics/third-party"""
    if not provider:
        return
    
    content = f"""
        <h2 style="color: #f59e0b; margin-bottom: 10px;">🚚 New Logistics Assignment</h2>
        <p>You have been assigned to handle logistics for a rental booking.</p>
        
        <div class="warning-box">
            <h3 style="margin-top: 0; color: #f59e0b;">📦 Delivery Details</h3>
            <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">#{booking.pk}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value">{booking.item.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Pickup Date:</span>
                <span class="detail-value">{booking.start_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Return Date:</span>
                <span class="detail-value">{booking.end_date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Provider:</span>
                <span class="detail-value"><strong>{provider}</strong></span>
            </div>
        </div>
        
        {f'<div class="info-box"><strong>📝 Additional Details:</strong><p style="margin: 10px 0 0 0;">{details}</p></div>' if details else ''}
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Please contact the renter and owner to coordinate pickup and delivery.
        </p>
    """
    
    html_content = get_email_base_template(content, "Logistics Assignment")
    subject = f"🚚 New logistics assignment - Booking #{booking.pk}"
    
    print(f"✅ Logistics email prepared for {provider}")