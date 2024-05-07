set mypath=%cd%
@echo %mypath%
cd %mypath%
cmd /c npm run start
timeout 5 >nul
exit