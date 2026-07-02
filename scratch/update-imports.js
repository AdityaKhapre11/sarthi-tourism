const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/import \{ Button \} from .@\/components\/ui\/button.;/g, 'import { Button } from "@/components/ui";');
  content = content.replace(/import \{ Loader \} from .@\/components\/ui\/Loader.;/g, 'import { Loader } from "@/components/ui";');
  content = content.replace(/import \{ ImageWithSkeleton \} from .@\/components\/ui\/ImageWithSkeleton.;/g, 'import { ImageWithSkeleton } from "@/components/ui";');
  content = content.replace(/import \{ ImageUploadModal \} from .@\/components\/ui\/ImageUploadModal.;/g, 'import { ImageUploadModal } from "@/components/ui";');
  content = content.replace(/import \{ ConfirmDeleteModal \} from .@\/components\/ui\/ConfirmDeleteModal.;/g, 'import { ConfirmDeleteModal } from "@/components/ui";');
  content = content.replace(/import DeletePackageButton from .@\/components\/ui\/DeletePackageButton.;/g, 'import { DeletePackageButton } from "@/components/ui";');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
