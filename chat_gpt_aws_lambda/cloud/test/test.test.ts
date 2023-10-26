const vala: string | undefined = '';
const valb: string | undefined = 'world';

if (vala || valb) {
  console.log('This will be logged.');
}

if (vala ?? valb) {
  console.log('This will also be logged.');
}
