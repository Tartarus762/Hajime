import Sequelize from 'sequelize'
// import timestamp_definition from './timestamp'

export default {
    name: "ScoreType",
    options: {
        timestamps: false,
    },
    getDefinition: (/* is_migration */) => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            code: {
                type: Sequelize.STRING(10),
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            visible: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 1
            },
            // ...is_migration && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}