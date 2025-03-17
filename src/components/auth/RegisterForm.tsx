import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import axios from 'axios';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'authority';
}

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setRegisterError(null);

    try {
      await axios.post('http://localhost:5000/api/users', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      navigate('/dashboard');
    } catch (error: any) {
      setRegisterError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {(registerError) && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{registerError}</p>
        </div>
      )}

      <Input
        label="Full Name"
        fullWidth
        error={errors.name?.message}
        {...register('name', { required: 'Name is required' })}
      />
      
      <Input
        label="Email"
        type="email"
        fullWidth
        error={errors.email?.message}
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
      />
      
      <Input
        label="Password"
        type="password"
        fullWidth
        error={errors.password?.message}
        {...register('password', { required: 'Password is required' })}
      />
      
      <Input
        label="Confirm Password"
        type="password"
        fullWidth
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', { 
          required: 'Please confirm your password',
          validate: value => value === password || 'Passwords do not match'
        })}
      />
      
      <Select
        label="Account Type"
        fullWidth
        error={errors.role?.message}
        options={[
          { value: 'user', label: 'Community Member' },
          { value: 'authority', label: 'Authority Representative' }
        ]}
        {...register('role', { required: 'Please select an account type' })}
      />
      
      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
