# GitHub Pages Deploy Notes

This repo includes a GitHub Actions workflow for Pages.

After the workflow exists on main, open repository Settings, then Pages, then set the build source to GitHub Actions if GitHub has not selected it automatically.

The app uses Vite with base set to /particleforge369/.

The build command is:

npm run build

The output folder is:

dist
