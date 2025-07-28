type emailTemplate = (
    {
        name: "verify",
        variables: {
            url: string
        }
    }
    |
    {
        name: "resetPassword",
        variables: {
            url: string
        }
    }
);

export default emailTemplate;