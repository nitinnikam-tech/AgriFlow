const fs = require('fs');
let content = fs.readFileSync('client/src/components/SmartTokenCard.jsx', 'utf8');

content = content.replace(
  /import \{ useLanguage \} from '\.\.\/context\/LanguageContext';/,
  "import { useLanguage } from '../context/LanguageContext';\nimport { useAuth } from '../context/AuthContext';"
);

content = content.replace(
  /  const \{ heroToken \} = useQueue\(\);/,
  "  const { heroToken } = useQueue();\n  const { user } = useAuth();"
);

content = content.replace(
  /\{heroToken\?\.farmerName \|\| 'Ramesh Patil'\}/,
  "{user?.name || heroToken?.farmerName || 'Ramesh Patil'}"
);

content = content.replace(
  /\{heroToken\?\.farmerPhone \|\| '9876543210'\}/,
  "{user?.phone || heroToken?.farmerPhone || '9876543210'}"
);

fs.writeFileSync('client/src/components/SmartTokenCard.jsx', content);
console.log('Fixed SmartTokenCard.jsx');
