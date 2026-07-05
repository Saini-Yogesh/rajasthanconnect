@echo off
title Rajasthan Connect - Image Finder
:: Change directory to the backend/ folder
cd /d "%~dp0..\..\..\"

:menu
cls
echo ========================================================
echo   📷 RAJASTHAN CONNECT - IMAGE FINDER MENU 📷
echo ========================================================
echo Find and update Pexels stock photos for generated JSON data.
echo Requires GROQ_API_KEY + PEXELS_API_KEY in backend/.env
echo.
echo  Normal run    = replace missing / Unsplash URLs, keep Pexels
echo  Retry failed  = continue after rate-limit errors
echo  Force         = re-fetch ALL images again
echo.
echo Select a dataset to update images:
echo.
echo  1. Districts                 9. Folk Arts
echo  2. Cities                   10. Folk Music Instruments
echo  3. Dynasties                11. Handicrafts
echo  4. History Rulers           12. Attire
echo  5. Places                   13. Communities ^& Tribes
echo  6. Historical Events        14. UNESCO Sites
echo  7. Foods (Cuisine)          15. Royal Wedding Venues
echo  8. Festivals                16. Unique Experiences
echo  17. Directory Listings
echo.
echo  18. UPDATE ALL (skip done records)
echo  19. DRY-RUN PREVIEW (3 per dataset)
echo  20. RETRY FAILED (from last run, all datasets)
echo  21. FORCE UPDATE ALL (replace every URL)
echo  22. Exit
echo ========================================================
set /p choice="Enter your choice (1-22): "

if "%choice%"=="1"  node "Rajasthan data/scripts/image_finder/run.js" --dataset=districts        & pause & goto menu
if "%choice%"=="2"  node "Rajasthan data/scripts/image_finder/run.js" --dataset=cities           & pause & goto menu
if "%choice%"=="3"  node "Rajasthan data/scripts/image_finder/run.js" --dataset=dynasties        & pause & goto menu
if "%choice%"=="4"  node "Rajasthan data/scripts/image_finder/run.js" --dataset=rulers           & pause & goto menu
if "%choice%"=="5"  node "Rajasthan data/scripts/image_finder/run.js" --dataset=places           & pause & goto menu
if "%choice%"=="6"  node "Rajasthan data/scripts/image_finder/run.js" --dataset=historical_events & pause & goto menu
if "%choice%"=="7"  node "Rajasthan data/scripts/image_finder/run.js" --dataset=foods            & pause & goto menu
if "%choice%"=="8"  node "Rajasthan data/scripts/image_finder/run.js" --dataset=festivals        & pause & goto menu
if "%choice%"=="9"  node "Rajasthan data/scripts/image_finder/run.js" --dataset=folk_arts        & pause & goto menu
if "%choice%"=="10" node "Rajasthan data/scripts/image_finder/run.js" --dataset=folk_music       & pause & goto menu
if "%choice%"=="11" node "Rajasthan data/scripts/image_finder/run.js" --dataset=handicrafts      & pause & goto menu
if "%choice%"=="12" node "Rajasthan data/scripts/image_finder/run.js" --dataset=attire           & pause & goto menu
if "%choice%"=="13" node "Rajasthan data/scripts/image_finder/run.js" --dataset=communities      & pause & goto menu
if "%choice%"=="14" node "Rajasthan data/scripts/image_finder/run.js" --dataset=unesco           & pause & goto menu
if "%choice%"=="15" node "Rajasthan data/scripts/image_finder/run.js" --dataset=royal_weddings   & pause & goto menu
if "%choice%"=="16" node "Rajasthan data/scripts/image_finder/run.js" --dataset=experiences      & pause & goto menu
if "%choice%"=="17" node "Rajasthan data/scripts/image_finder/run.js" --dataset=directory        & pause & goto menu
if "%choice%"=="18" node "Rajasthan data/scripts/image_finder/run.js" --all                      & pause & goto menu
if "%choice%"=="19" node "Rajasthan data/scripts/image_finder/run.js" --all --limit=3 --dry-run  & pause & goto menu
if "%choice%"=="20" node "Rajasthan data/scripts/image_finder/run.js" --all --retry-failed       & pause & goto menu
if "%choice%"=="21" node "Rajasthan data/scripts/image_finder/run.js" --all --force              & pause & goto menu
if "%choice%"=="22" exit
goto menu
