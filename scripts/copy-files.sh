# Copy files from (source) to (destination) directory
# source: source directory
# destination: destination directory
# example: copy-files.sh /source /destination

source=$1
destination=$2

# create destination directory
mkdir -p $destination

# copy files
cp -r $source $destination

# check if files are copied
if [ $? -eq 0 ]; then
    echo "Files copied successfully"
else
    echo "Error: Files not copied"
fi
