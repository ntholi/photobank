import { prisma } from '@/lib/db';

type LocationData = {
    name: string;
    lat: number;
    lng: number;
};

export type PhotoData = {
    name: string;
    description: string;
    location: LocationData;
    photoUrl: string;
    tags: string[];
};

export const savePhoto = async (photo: PhotoData, userId: string) => {
    const location = await saveLocation(photo.location);

    await prisma.photo.create({
        data: {
            name: photo.name,
            location: {
                connect: location,
            },
            description: photo.description,
            url: photo.photoUrl,
            user: {
                connect: {
                    id: userId,
                },
            },
            tags: {
                create: photo.tags.map((tag) => ({
                    tag: {
                        connectOrCreate: {
                            where: {
                                name: tag,
                            },
                            create: {
                                name: tag,
                            },
                        },
                    },
                })),
            },
        },
    });
};

const saveLocation = async (location: LocationData) => {
    return await prisma.location.upsert({
        where: {
            name: location.name,
        },
        update: {},
        create: {
            name: location.name,
            lat: location.lat,
            lng: location.lng,
        },
    });
};
