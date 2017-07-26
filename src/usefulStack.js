function usefulStack(err) {
  return err.stack
    .split('\n')
    .filter(line => !line.includes('node_modules'))
    .join('\n');
};

module.exports = usefulStack;
