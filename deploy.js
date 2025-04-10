#!/usr/bin/env node

/**
 * Vercel Deployment Helper Script
 * 
 * This script guides users through deploying the WordWise dictionary app to Vercel.
 * It checks for prerequisites and provides step-by-step instructions.
 */

const { execSync } = require('child_process');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🚀 WordWise Vercel Deployment Helper\n');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('❌ Vercel CLI is not installed');
  console.log('Please install it with: npm install -g vercel');
  rl.close();
  process.exit(1);
}

// Generate a random secret for NextAuth
const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Main deployment function
const deploy = async () => {
  console.log('\n📋 Deployment Steps:');
  console.log('1. We\'ll help you set up environment variables');
  console.log('2. You\'ll need to log into Vercel if not already logged in');
  console.log('3. The deployment will start automatically\n');

  rl.question('Ready to continue? (y/n): ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('\nDeployment cancelled. Run this script again when you\'re ready.');
      rl.close();
      return;
    }

    console.log('\n🔐 Setting up environment variables...');
    const secret = generateSecret();
    
    console.log(`\nWe've generated a secure random key for NEXTAUTH_SECRET: ${secret}`);
    console.log('\nDuring Vercel setup, you\'ll need to set these environment variables:');
    console.log(`- NEXTAUTH_SECRET: ${secret}`);
    console.log('- NEXTAUTH_URL: Your Vercel deployment URL (will be set automatically by Vercel)');

    console.log('\n🔄 Starting Vercel deployment process...');
    console.log('Follow the prompts from Vercel CLI to complete your deployment\n');

    try {
      // Execute Vercel deployment command
      execSync('vercel', { stdio: 'inherit' });
      
      console.log('\n✅ Deployment initiated successfully!');
      console.log('\nRemember to set your environment variables in the Vercel dashboard if needed.');
      console.log('Once deployment is complete, your app will be available at your Vercel URL.');
    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      console.log('Please check the error message and try again.');
    }
    
    rl.close();
  });
};

// Start the deployment process
deploy().catch(console.error); 