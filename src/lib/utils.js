import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function convertFilesToTreeItems(files) {
  const tree = {}

  // 1️⃣ Build nested object tree
  Object.keys(files)
    .sort()
    .forEach((filePath) => {
      const parts = filePath.split("/")
      let current = tree

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const isFile = i === parts.length - 1

        if (!current[part]) {
          current[part] = isFile ? null : {}
        }

        if (!isFile) {
          current = current[part]
        }
      }
    })

  // 2️⃣ Convert object tree → UI tree items
  function convertNode(node, name) {
    if (node === null) {
      return {
        name,
        type: "file",
      }
    }

    const children = Object.entries(node).map(([key, value]) =>
      convertNode(value, key)
    )

    return {
      name,
      type: "folder",
      children,
    }
  }

  return Object.entries(tree).map(([key, value]) =>
    convertNode(value, key)
  )
}