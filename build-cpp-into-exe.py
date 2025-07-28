import subprocess as sub

# Update package lists
sub.run(["sudo", "apt", "update"], check=True)

# Install mingw-w64 with -y to auto-confirm
sub.run(["sudo", "apt", "install", "-y", "mingw-w64"], check=True)

# Add universe repository (may already be enabled)
sub.run(["sudo", "apt-add-repository", "-y", "universe"], check=True)

# Update again after adding repository
sub.run(["sudo", "apt", "update"], check=True)

# Compile the C++ file
sub.run(["x86_64-w64-mingw32-g++", "-static", "-o", "my_program.exe", "main.cpp"], check=True)
