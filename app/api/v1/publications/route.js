import {createEndpoint} from "../../../../server/createEndpoint.js";
import {NextResponse} from "next/server";
import {getAllPublications, createPublication} from "../../../../server/features/publication/PublicationService.js";
import Joi from "joi";

export const GET = createEndpoint(async () => {
    const publications = await getAllPublications();
    return NextResponse.json(publications);
}, null, true);

export const POST = createEndpoint(async (request, body) => {
    const publication = await createPublication(body);
    return NextResponse.json(publication);
}, Joi.object({
    id_publication: Joi.string().required(),
    redirectionLink: Joi.string().required(),
    date: Joi.string().required(),
    revista: Joi.string().required(),
    número: Joi.string().required()
}), true);

