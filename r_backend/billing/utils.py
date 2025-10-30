import razorpay
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from .serializers import BillSerializer

# Initialize Razorpay
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


def initiate_razorpay_payment(bill):
    """Create Razorpay order"""
    order = client.order.create({
        'amount': int(bill.total_amount * 100),  # paise
        'currency': 'INR',
        'receipt': bill.bill_number,
        'payment_capture': 1
    })
    
    bill.razorpay_order_id = order['id']
    bill.save()
    
    return {
        "razorpay_order_id": order['id'],
        "amount": float(bill.total_amount),
        "razorpay_key_id": settings.RAZORPAY_KEY_ID,
        "bill": BillSerializer(bill).data
    }


def verify_razorpay_signature(order_id, payment_id, signature):
    """Verify Razorpay signature"""
    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        })
        return True
    except:
        return False


def send_bill_email(bill):
    """Send bill email"""
    subject = f"Your Rentify Invoice #{bill.bill_number}"
    message = render_to_string('billing/emails/bill_created.html', {'bill': bill})
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [bill.user.email])

def send_payment_confirmation_email(bill, payment_id):
    """Send payment confirmation email to user."""
    subject = f"✅ Payment Confirmed for Invoice #{bill.bill_number}"
    message = render_to_string(
        'billing/emails/payment_confirmation.html', 
        {'bill': bill, 'payment_id': payment_id}
    )
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [bill.user.email])