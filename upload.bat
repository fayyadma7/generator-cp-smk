@echo off
echo Meng-upload perbaikan ke GitHub...
git add package.json
git commit -m "Fix package.json versions"
git push
echo.
echo Selesai! Perbaikan sudah diupload. Vercel akan otomatis melakukan redeploy.
pause
