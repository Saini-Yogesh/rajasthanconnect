@echo off
title Rajasthan Connect - Database Seed Data Generator
:: Change directory to the backend/ folder (parent of scripts/)
cd /d "%~dp0.."

:menu
cls
echo ========================================================
echo   🕌 RAJASTHAN CONNECT - SEED DATA GENERATOR MENU 🕌
echo ========================================================
echo Please select a table to generate data for:
echo.
echo  1. Districts                 11. Handicrafts
echo  2. Cities                    12. Attire
echo  3. Dynasties                 13. Languages
echo  4. History Rulers            14. Communities ^& Tribes
echo  5. Places                    15. Cultural Etiquette
echo  6. Historical Events         16. UNESCO Sites
echo  7. Foods (Cuisine)           17. Royal Wedding Venues
echo  8. Festivals                 18. Unique Experiences
echo  9. Folk Arts                 19. Directory Listings
echo  10. Folk Music Instruments    20. Reviews
echo.
echo  21. GENERATE ALL TABLES (Sequential)
echo  22. Exit
echo ========================================================
set /p choice="Enter your choice (1-22): "

if "%choice%"=="1" node scripts/generate_tables.js --table districts & pause & goto menu
if "%choice%"=="2" node scripts/generate_tables.js --table cities & pause & goto menu
if "%choice%"=="3" node scripts/generate_tables.js --table dynasties & pause & goto menu
if "%choice%"=="4" node scripts/generate_tables.js --table history_rulers & pause & goto menu
if "%choice%"=="5" node scripts/generate_tables.js --table places & pause & goto menu
if "%choice%"=="6" node scripts/generate_tables.js --table historical_events & pause & goto menu
if "%choice%"=="7" node scripts/generate_tables.js --table foods & pause & goto menu
if "%choice%"=="8" node scripts/generate_tables.js --table festivals & pause & goto menu
if "%choice%"=="9" node scripts/generate_tables.js --table folk_arts & pause & goto menu
if "%choice%"=="10" node scripts/generate_tables.js --table folk_music_instruments & pause & goto menu
if "%choice%"=="11" node scripts/generate_tables.js --table handicrafts & pause & goto menu
if "%choice%"=="12" node scripts/generate_tables.js --table attire & pause & goto menu
if "%choice%"=="13" node scripts/generate_tables.js --table languages & pause & goto menu
if "%choice%"=="14" node scripts/generate_tables.js --table communities_tribes & pause & goto menu
if "%choice%"=="15" node scripts/generate_tables.js --table cultural_etiquette & pause & goto menu
if "%choice%"=="16" node scripts/generate_tables.js --table unesco_sites & pause & goto menu
if "%choice%"=="17" node scripts/generate_tables.js --table royal_wedding_venues & pause & goto menu
if "%choice%"=="18" node scripts/generate_tables.js --table unique_experiences & pause & goto menu
if "%choice%"=="19" node scripts/generate_tables.js --table directory_listings & pause & goto menu
if "%choice%"=="20" node scripts/generate_tables.js --table reviews & pause & goto menu
if "%choice%"=="21" node scripts/generate_tables.js --all & pause & goto menu
if "%choice%"=="22" exit
goto menu
