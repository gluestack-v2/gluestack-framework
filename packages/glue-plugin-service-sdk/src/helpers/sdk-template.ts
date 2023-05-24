const template = (instanceName: string) =>
  `
  import axios from "axios";

  const ${instanceName} = {
    // **---Functions will be added after this---**
  };
  export default ${instanceName};
  
`;

export default template;
