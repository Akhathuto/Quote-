
import React from 'react';
import { CreditCard, CheckCircle, Shield } from 'lucide-react';

const PaymentsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Payments & Subscription</h1>
        <p className="mt-2 text-gray-400">Manage your billing information and subscription plan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan */}
        <div className="lg:col-span-2">
            <div className="bg-brand-secondary p-8 rounded-lg border border-gray-700 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Current Plan</h2>
                <div className="bg-brand-dark p-6 rounded-lg border border-gray-600 flex justify-between items-center">
                    <div>
                        <p className="text-lg font-semibold text-brand-accent">Pro Plan</p>
                        <p className="text-gray-400">Renews on July 31, 2024</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">R1,499.00 <span className="text-base font-normal text-gray-400">/ month</span></p>
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Plan Features:</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Unlimited RFQs</li>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> AI Supplier Matching</li>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> PDF & Spreadsheet Generation</li>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Priority Support</li>
                    </ul>
                </div>
                 <div className="mt-6 flex space-x-4">
                    <button className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-blue-600">
                        Change Plan
                    </button>
                    <button className="flex-1 justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-700">
                        Cancel Subscription
                    </button>
                </div>
            </div>
        </div>

        {/* Payment Method */}
        <div className="lg:col-span-1">
          <div className="bg-brand-secondary p-8 rounded-lg border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Payment Method</h2>
            <div className="bg-brand-dark p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between">
                    <p className="font-semibold">Visa ending in 1234</p>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 bg-white px-1 rounded-sm"/>
                </div>
                <p className="text-sm text-gray-400 mt-1">Expires 12/2026</p>
                <button className="text-sm text-brand-primary hover:underline mt-4">Update Payment Method</button>
            </div>
            <p className="flex items-center text-xs text-gray-500 mt-4">
                <Shield size={14} className="mr-2" /> Secure payments powered by Stripe.
            </p>
            <h3 className="text-lg font-semibold text-white mt-6 mb-2">Billing History</h3>
            <ul className="space-y-2">
                <li className="text-sm text-gray-400 hover:text-brand-primary hover:underline cursor-pointer"><a>Invoice #120624 - June 2024</a></li>
                <li className="text-sm text-gray-400 hover:text-brand-primary hover:underline cursor-pointer"><a>Invoice #120524 - May 2024</a></li>
                <li className="text-sm text-gray-400 hover:text-brand-primary hover:underline cursor-pointer"><a>Invoice #120424 - April 2024</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
