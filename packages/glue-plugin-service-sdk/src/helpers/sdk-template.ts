const template = (instanceName: string) =>
  `
import axios from "axios";
// **---Import will be added before this---**

export class SDK {
  
  constructor() {
    // **---Constructor will be added before this---**
  }

  // **---Frontend SDK will be added before this---**

  // **---Functions will be added after this---**
}
`;

export default template;
