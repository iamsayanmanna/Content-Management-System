<?php

// PenSpace Payment Configuration

return [
    /*
    |--------------------------------------------------------------------------
    | Razorpay Configuration
    |--------------------------------------------------------------------------
    */

    'razorpay' => [
        'key_id' => getenv('RAZORPAY_KEY_ID') ?: '',
        'key_secret' => getenv('RAZORPAY_KEY_SECRET') ?: '',
        'webhook_secret' => getenv('RAZORPAY_WEBHOOK_SECRET') ?: '',
    ],

    /*
    |--------------------------------------------------------------------------
    | Stripe Configuration
    |--------------------------------------------------------------------------
    */

    'stripe' => [
        'secret_key' => getenv('STRIPE_SECRET_KEY') ?: '',
        'publishable_key' => getenv('STRIPE_PUBLISHABLE_KEY') ?: '',
        'webhook_secret' => getenv('STRIPE_WEBHOOK_SECRET') ?: '',
    ],

    /*
    |--------------------------------------------------------------------------
    | Subscription Plans
    |--------------------------------------------------------------------------
    */

    'plans' => [
        'free' => [
            'monthly' => 0,
            'yearly' => 0,
        ],

        'pro' => [
            'monthly' => 299,
            'yearly' => 2870,
        ],

        'team' => [
            'monthly' => 799,
            'yearly' => 7670,
        ],
    ],

    'currency' => 'INR',
];