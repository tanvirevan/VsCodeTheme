document.addEventListener('DOMContentLoaded', () => 
    {
        const commandPaletteSelector = ".quick-input-widget";
        const targetSelector = ".monaco-workbench";
        const blurElementId = "command-blur";
        let observer;

        function runMyScript() 
            {
                const targetDiv = document.querySelector(targetSelector);

                if (!targetDiv) return;

                // Remove existing blur element if it exists
                const existingElement = document.getElementById(blurElementId);
                if (existingElement) 
                    {
                        existingElement.remove();
                    }

                // Create and configure the new blur element
                const newElement = document.createElement("div");
                newElement.setAttribute('id', blurElementId);

                // Remove blur element on click
                newElement.addEventListener('click', () => newElement.remove());

                // Append the blur element to the target div
                targetDiv.appendChild(newElement);
            }

        function handleEscape() 
            {
                const element = document.getElementById(blurElementId);
                if (element) 
                    {
                        element.remove();
                    }
            }

        function observeCommandDialog(commandDialog) 
            {
                if (observer) 
                    {
                        observer.disconnect(); // Disconnect any existing observer
                    }

                observer = new MutationObserver(mutations => 
                        {
                            for (let mutation of mutations) 
                                {
                                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') 
                                        {
                                            if (commandDialog.style.display === 'none') 
                                                {
                                                    handleEscape();
                                                } 
                                            else 
                                                {
                                                    runMyScript();
                                                }
                                        }
                            }
                        });

                observer.observe(commandDialog, { attributes: true });
            }

        function checkCommandDialog() 
            {
                const commandDialog = document.querySelector(commandPaletteSelector);
                if (commandDialog) 
                    {
                        // Apply blur if the command dialog is already visible
                        if (commandDialog.style.display !== "none") 
                            {
                                runMyScript();
                            }
                        // Start observing the command dialog
                        observeCommandDialog(commandDialog);
                        return true;
                    }
                return false;
            }

        // Initial check for the command dialog
        const initialCheckInterval = setInterval(() => 
            {
                if (checkCommandDialog()) 
                    {
                        clearInterval(initialCheckInterval);
                    } 
                else 
                    {
                        console.log("Command dialog not found yet. Retrying...");
                    }
            }, 500); // Check every 500ms

        // Keydown event listeners
        document.addEventListener('keydown', (event) => 
            {
                const isCmdPalette = (event.metaKey || event.ctrlKey) && event.key === 'p';
                const isEscape = event.key === 'Escape' || event.key === 'Esc';

                if (isCmdPalette) 
                    {
                        event.preventDefault();
                        runMyScript();
                    } 
                else if (isEscape) 
                    {
                        event.preventDefault();
                        handleEscape();
                    }
        }, true);
    });
