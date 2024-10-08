ROOT_DIR=$(pwd)
OUT_DIR=examples/build/fenix-store
PROJECTS=(
  example-todo-react
  example-todo-svelte
)

# Clean up output folder
rm -rf $OUT_DIR

# For each project path build and copy files
for project in "${PROJECTS[@]}"
do
  PROJECT_DIR=examples/$project

  cd $PROJECT_DIR

  yarn

  yarn build

  cd $ROOT_DIR

  sh scripts/copy-files.sh $PROJECT_DIR/dist/. $OUT_DIR/$project
done
