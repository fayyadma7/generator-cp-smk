@echo off
echo ============================================================
echo  CLEANUP GITHUB — Hapus file yang tidak relevan
echo  SMK Muhammadiyah 3 Purbalingga
echo ============================================================
echo.

echo [1/4] Hapus file dari tracking Git (bukan dari disk lokal)...
git rm --cached opencode.json 2>nul && echo   OK: opencode.json || echo   SKIP: opencode.json tidak ada di git
git rm --cached upload.bat 2>nul && echo   OK: upload.bat || echo   SKIP: upload.bat tidak ada di git
git rm --cached -r .opencode/ 2>nul && echo   OK: .opencode/ || echo   SKIP: .opencode/ tidak ada di git

echo.
echo [2/4] Pastikan lampiranSchema.js dan modulAjarPromptGenerator.js masih diperlukan...
echo   (Jika tidak dipakai, hapus manual dan jalankan: git rm lampiranSchema.js modulAjarPromptGenerator.js)

echo.
echo [3/4] Stage semua perubahan (.gitignore update + cleanup)...
git add .gitignore
git add -A

echo.
echo [4/4] Commit dan push ke GitHub...
git commit -m "chore: cleanup file tidak relevan, update .gitignore"
git push

echo.
echo ============================================================
echo  SELESAI! Repository sudah bersih.
echo  Vercel akan otomatis redeploy jika terhubung ke GitHub.
echo ============================================================
pause
