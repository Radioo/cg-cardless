import {Banner} from '@/components/banner';

export function CardWarning() {
    return (
        <Banner
            variant="warning"
            message="No card saved. Please go to Settings to add your card."
        />
    );
}
