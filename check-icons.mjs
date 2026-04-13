import * as Icons from 'lucide-react';
const names = ['Mail','Lock','LogIn','LogInIcon','LogIn2','Github','GitHub','GithubIcon','GitHubIcon'];
for (const n of names) {
  console.log(n, Object.prototype.hasOwnProperty.call(Icons, n));
}
console.log('Available samples:', Object.keys(Icons).slice(0,50));
