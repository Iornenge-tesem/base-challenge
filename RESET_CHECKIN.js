// Copy and paste this into your browser console to reset check-in state for testing

localStorage.removeItem('hasCheckedInToday');
console.log('✅ Check-in state reset! You can now test the check-in flow again.');
console.log('Current stored data:');
console.log('- Streak:', localStorage.getItem('streak'));
console.log('- Points:', localStorage.getItem('points'));
console.log('- Has Checked In Today:', localStorage.getItem('hasCheckedInToday'));
