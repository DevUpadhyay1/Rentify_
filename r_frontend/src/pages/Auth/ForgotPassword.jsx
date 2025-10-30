import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button, Input, Alert, Card } from '../../components/common';
import { useAuthContext } from '../../context';
import { validateEmail } from '../../utils';

const ForgotPassword = () => {
  const { forgotPassword, loading } = useAuthContext();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error?.response?.data?.message || 'Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="lg">
        {/* Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-4">
            <span className="text-3xl font-bold">R</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <Alert
            type="success"
            title="Email Sent!"
            message="Check your inbox for password reset instructions."
            className="mb-6"
          />
        )}

        {/* Error Message */}
        {error && (
          <Alert
            type="error"
            message={error}
            dismissible
            onClose={() => setError('')}
            className="mb-6"
          />
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              icon={<Mail size={18} />}
              required
              fullWidth
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
            >
              Send Reset Link
            </Button>
          </form>
        )}

        {/* Success Actions */}
        {success && (
          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
            >
              Send Another Link
            </Button>
            <Link to="/login">
              <Button variant="ghost" fullWidth>
                Back to Login
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;