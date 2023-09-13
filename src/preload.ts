// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const addStyle = (styleString: string) => {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
};

document.addEventListener('DOMContentLoaded', () => {
  addStyle(`
::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.1);
}
  
::-webkit-scrollbar {
    width: 6px;
    background-color: #F5F5F5;
}
  
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #555;
}
  `);
});
