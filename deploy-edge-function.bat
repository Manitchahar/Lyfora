@echo off
echo ========================================
echo Deploying Persona Chat Edge Function
echo ========================================
echo.

echo Checking Supabase CLI...
call npx supabase --version
if errorlevel 1 (
    echo ERROR: Supabase CLI not found
    exit /b 1
)

echo.
echo Deploying persona-chat function...
call npx supabase functions deploy persona-chat

if errorlevel 1 (
    echo.
    echo ERROR: Deployment failed!
    echo.
    echo Troubleshooting:
    echo 1. Make sure you're logged in: npx supabase login
    echo 2. Link your project: npx supabase link --project-ref hvqszwkacdfumdoeapti
    echo 3. Check GEMINI_API_KEY secret: npx supabase secrets list
    exit /b 1
)

echo.
echo ========================================
echo Deployment successful!
echo ========================================
echo.
echo Testing the deployment...
call node test-edge-function.js

echo.
echo Done! Check the test results above.
