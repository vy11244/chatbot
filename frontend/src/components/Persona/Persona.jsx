import { Textarea } from "@mantine/core"
import appStrings from "../../utils/strings"

export default function Persona(){


    return ( 

<Textarea
                    variant="unstyled"
                    label={appStrings.language.develop.title1}
                    autosize
                    minRows={50}
                    maxRows={50}
                    placeholder={appStrings.language.develop.description}
                    labelProps={{ style: { fontSize: '18px', fontWeight: 'bold' } }}
                />

    )
};