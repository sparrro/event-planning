type emailTemplate = (
    {
        name: "verify",
        variables: {
            url: string
        }
    } |
    {
        name: "resetPassword",
        variables: {
            
        }
    }
);

export default emailTemplate;