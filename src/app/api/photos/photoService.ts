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
    labels: {
        name: string;
        score: number;
    }[];
};

export const savePhoto = async (photo: PhotoData, userId: string) => {
    const location = await saveLocation(photo.location);

    return await prisma.photo.create({
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
            labels: {
                create: photo.labels.map((it) => ({
                    score: it.score,
                    label: {
                        connectOrCreate: {
                            where: {
                                name: it.name,
                            },
                            create: {
                                name: it.name,
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
