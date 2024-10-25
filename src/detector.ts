export interface DevToolsDetectorOptions {
    consoleLog?: boolean;    
    checkDuration?: number | "always"; 
    blockIfDetected?: boolean;   
}

export class DevToolsDetector {
    private isDebuggerOpen: boolean = false;
    private detectionTimeout: any = null; 
    private checking: boolean = true;

    constructor(
        private allowedPaths: string[],
        private options: DevToolsDetectorOptions = { consoleLog: true, checkDuration: "always", blockIfDetected: true }
    ) {
        if (this.options.checkDuration !== "always" && typeof this.options.checkDuration === "number") {
            this.detectionTimeout = setTimeout(() => {
                this.checking = false;
                if (this.options.consoleLog) {
                    console.log("Stopped checking for developer tools.");
                }
            }, this.options.checkDuration);
        }
    }

    public isPathAllowed(path: string): boolean {
        return this.allowedPaths.includes(path);
    }

    public getDetectionScript(): string {
        return `
            <script>
                (function() {
                    let isDebuggerOpen = false;
                    const checking = ${this.options.checkDuration === "always" ? "true" : "false"};
                    const blockIfDetected = ${this.options.blockIfDetected};

                    function checkDevTools() {
                        const devToolsOpened = isDebuggerStatementFired();
                        if (devToolsOpened && !isDebuggerOpen) {
                            isDebuggerOpen = true;
                            if (${this.options.consoleLog}) {
                                fetch('/log-devtools-detected', { method: 'POST' });
                            }
                            if (blockIfDetected) {
                                debugger;
                                redirectToBlankOnUnpause();
                            }
                        } else if (!devToolsOpened && isDebuggerOpen) {
                            isDebuggerOpen = false;
                        }
                    }

                    function isDebuggerStatementFired() {
                        let detected = false;
                        const check = () => {
                            detected = true;
                        };
                        const debugEval = eval.toString().length === 37;
                        if (debugEval) {
                            debugger;
                            check();
                        }
                        return detected;
                    }

                    function redirectToBlankOnUnpause() {
                        window.addEventListener('keydown', () => { if (blockIfDetected) window.location.href = 'about:blank'; });
                        window.addEventListener('mousedown', () => { if (blockIfDetected) window.location.href = 'about:blank'; });
                    }

                    if (checking) setInterval(checkDevTools, 1000);
                })();
            </script>
        `;
    }
}

export default DevToolsDetector;
